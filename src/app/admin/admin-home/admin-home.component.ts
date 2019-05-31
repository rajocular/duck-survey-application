import {Component, OnInit} from '@angular/core';
import {SurveyService} from "../../services/survey.service";
import {CategoryService} from "../../services/category.service";
import {Category, Food} from "../../models/food.model";
import {FoodService} from "../../services/food.service";
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  surveys;
  categories: Category[];
  foods: Food[];
  countries: string[];
  cities: string[];
  citySelected = 'None';
  countrySelected = 'None';
  categorySelected = 'None';
  foodSelected = 'None';

  loading = false;

  filteredCountries:any[] = [];
  filteredCities:any[] = [];

  duckCount = {};
  peakHour = {};
  popularFood = {};

  categoryData = {};
  foodData = {};

  constructor(private surveyService: SurveyService, private categoryService: CategoryService,
              private foodService: FoodService, private loginService: LoginService) { }

  ngOnInit() {
    this.loading = true;
    this.fetchData();
    this.fetchCategories();
    this.fetchProducts();
    this.fetchSurveys();
  }

  fetchData(){
    this.surveyService.getData("country").subscribe(data=>{
      this.countries = data.list;
    });
    this.surveyService.getData("city").subscribe(data=>{
      this.cities = data.list;
    });
  }

  fetchSurveys() {
    this.surveyService.getSurveys();
    this.surveyService.getSurveyListener().subscribe(surveys=>{
      this.surveys = surveys;
      this.onCountrySelect();
      this.onCitySelect();
    })
  }

  fetchCategories() {
    this.categoryService.getCategories();
    this.categoryService.getCategoryListener()
      .subscribe(data => {
        this.categories = data;
      })
  }

  fetchProducts() {
    this.foodService.getFoods();
    this.foodService.getFoodListener()
      .subscribe(data=>{
        this.foods = data;
      })
  }

  onCountrySelect() {
    this.loading = true;
    if(this.countrySelected != 'None'){
      this.filteredCountries = this.surveys.filter(item => item.country.toLowerCase() === this.countrySelected.toLowerCase())
    }
    else
      this.filteredCountries = this.surveys;
    this.geoResult("country")
  }

  onCitySelect() {
    this.loading = true;
    if(this.citySelected != 'None'){
      this.filteredCities = this.surveys.filter(item => item.city.toLowerCase() === this.citySelected.toLowerCase())
    }
    else
      this.filteredCities = this.surveys;
    this.geoResult("city")
  }

  geoResult(type) {
    let count = 0;
    let foodData = {};
    let timingData = {};
    let surveyList = this.filteredCities;
    if(type === "country")
      surveyList = this.filteredCountries;
    surveyList.forEach(survey => {
      count += survey.ducks;
      survey.foods.forEach(foodItem => {
        let food = foodItem.food.name;
        let quantity = foodItem.quantity;
        if(food in foodData){
          foodData[food] += quantity;
        } else {
          foodData[food] = quantity;
        }
      });
      survey.days.forEach(schedule => {
        schedule.timings.forEach(time => {
          let hour = time.split(':')[0];
          if(hour in timingData)
            timingData[hour] += 1;
          else
            timingData[hour] = 1;
        })
      })
    });
    let max = 0;
    for(let time in timingData)
      if(timingData[time] > max){
        max = timingData[time];
        this.peakHour[type] = time
      }
    max = 0;
    for(let food in foodData)
      if(foodData[food] > max){
        max = foodData[food];
        this.popularFood[type] = food;
      }
    this.duckCount[type] = count;
    this.loading = false;
  }

  onCategorySelect() {
    this.loading = true;
    let countries = {};
    let cities = {};
    let count = 0;
    let duckCount = 0;
    if(this.categorySelected != 'None'){
      this.surveys.forEach(survey => {
        let country = survey.country;
        let city = survey.city;
        survey.foods.forEach(foodItem => {
          let category = foodItem.food.category.name;
          if(category === this.categorySelected){
            count += 1;
            duckCount += survey.ducks;
            if(country in countries){
              countries[country] += 1
            }else {
              countries[country] = 1
            }

            if(city in cities)
              cities[city] += 1;
            else
              cities[city] = 1
          }
        })
      });
      this.categoryData['surveyCount'] = count;
      this.categoryData['duckCount'] = duckCount;
    }
    else
      this.categoryData['duckCount'] = 0;

    let data = this.sortObject(countries);
    if(data.length>0) {
      this.categoryData['mostPopularCountry'] = data[data.length - 1]["key"];
      this.categoryData['leastPopularCountry'] = data[0]["key"];

    }

    data = this.sortObject(cities);
    if(data.length>0) {
      this.categoryData['mostPopularCity'] = data[data.length - 1]["key"];
      this.categoryData['leastPopularCity'] = data[0]["key"];
    }

    this.loading = false;
  }

  onFoodSelect() {
    this.loading = true;
    let countries = {};
    let cities = {};
    let count = 0;
    let duckCount = 0;
    if(this.foodSelected != 'None'){
      this.surveys.forEach(survey => {
        let country = survey.country;
        let city = survey.city;
        survey.foods.forEach(foodItem => {
          let food = foodItem.food.name;
          if(food === this.foodSelected){
            count += 1;
            duckCount += survey.ducks;
            if(country in countries){
              countries[country] += 1
            }else {
              countries[country] = 1
            }

            if(city in cities)
              cities[city] += 1;
            else
              cities[city] = 1
          }
        })
      });
      this.foodData['surveyCount'] = count;
      this.foodData['duckCount'] = duckCount;
    }
    else
      this.foodData['duckCount'] = 0;

    let data = this.sortObject(countries);
    if(data.length>0) {
      this.foodData['mostPopularCountry'] = data[data.length - 1]["key"];
      this.foodData['leastPopularCountry'] = data[0]["key"];

    }

    data = this.sortObject(cities);
    if(data.length>0) {
      this.foodData['mostPopularCity'] = data[data.length - 1]["key"];
      this.foodData['leastPopularCity'] = data[0]["key"];
    }

    this.loading = false;
  }

  sortObject(dict) {
    let arr = [];
    for (let key in dict) {
      if (dict.hasOwnProperty(key)) {
        arr.push({
          key,
          value: dict[key]
        });
      }
    }
    arr.sort((a, b) => { return a.value - b.value; });
    return arr;
  }

}
