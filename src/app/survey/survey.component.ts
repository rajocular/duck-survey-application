import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FoodService} from "../services/food.service";
import {Category, Food} from "../models/food.model";
import {SurveyService} from "../services/survey.service";
import {Survey} from "../models/survey.model";
import {CategoryService} from "../services/category.service";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  surveyForm: FormGroup;
  foodForm: FormGroup;
  dayForm: FormGroup;

  foods: Food[];
  categories: Category[];

  categorySelected = "None";
  daySelected = "None";
  foodSelected = "None";

  submitMessage;

  foodList = [];
  schedule= [];

  dayChoices = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  defaultTime = {hour:0, minute:0};
  foodOptions = [];

  locationData;
  isDisabled;
  loading = false;

  constructor(private foodService: FoodService, private surveyService: SurveyService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.fetchCategories();
    this.fetchProducts();
    this.initForm();
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

  initForm() {
    this.surveyForm = new FormGroup({
      name: new FormControl('', {validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9 -,\'\"]*$')]}),
      city: new FormControl('', {validators: [Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]}),
      country: new FormControl('', {validators: [Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')]}),
      ducks: new FormControl('', {validators: [Validators.required, Validators.pattern('^[0-9]*$')]})
    });
    this.foodForm = new FormGroup({
      food: new FormControl(''),
      quantity: new FormControl(0)
    });
    this.dayForm = new FormGroup({
      day: new FormControl(''),
      timing: new FormControl(this.defaultTime)
    })
  }

  filterFood(){
    if(this.categorySelected === "None")
      this.foodOptions = this.foods;
    else
      this.foodOptions = this.foods.filter(item=> item.category.name === this.categorySelected)
  }

  addItem(){
    this.foods = this.foods.filter(item=>item != this.foodForm.value.food);
    this.foodList.push(this.foodForm.value);
    this.foodForm.markAsUntouched();
  }

  removeItem(removedItem){
    this.foods = [removedItem.food, ...this.foods];
    this.foodList = this.foodList.filter(item=>item != removedItem);
  }

  addTiming() {
    let day = this.dayForm.value.day;
    let cleanTiming = this.cleanTime(this.dayForm.value.timing);
    let dayNotInList = true

    if(this.schedule.length>0)
      for(let i=0; i<this.schedule.length; i++){
        if(this.schedule[i].day === day){
          if(!this.schedule[i].timings.includes(cleanTiming))
            this.schedule[i].timings = [...this.schedule[i].timings, cleanTiming];
          dayNotInList = false
        }
      }
    if(dayNotInList)
      this.schedule.push({day: day, timings: [cleanTiming]});
  }

  cleanTime(time){
    let hour = time.hour.toString();
    let minute = time.minute.toString();
    if(hour.length == 1)
      hour = "0" + hour;
    if(minute.length == 1)
      minute = "0" + minute;
    return (hour + ":" + minute)
  }

  removeTime(day,time){
    for(let i=0; i<this.schedule.length; i++){
      if(this.schedule[i].day === day){
        this.schedule[i].timings = this.schedule[i].timings.filter(item => item != time)
      }
    }
  }

  fetchLocation() {
    // this.surveyService.getLocation()
    this.isDisabled = true;
    if(navigator.geolocation){
      this.loading = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.loading = false;
      });
    }
  }

  removeLocation() {
    this.isDisabled = false;
    this.locationData = undefined;
  }

  submitSurvey() {
    let location = this.locationData ? this.locationData : {city: this.surveyForm.value.city, country: this.surveyForm.value.country};
    const surveyData: Survey = Object.assign({}, {
      place: this.surveyForm.value.name,
      ducks: this.surveyForm.value.ducks,
      foods: this.foodList,
      days: this.schedule,
      location
    });
    this.surveyService.addSurvey(surveyData);
    this.surveyService.getSurveyListener().subscribe(message=>{
      this.submitMessage = message;
    })
  }

}
