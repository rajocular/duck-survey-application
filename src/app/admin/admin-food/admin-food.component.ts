import { Component, OnInit } from '@angular/core';
import {FoodService} from "../../services/food.service";
import {Category, Food} from "../../models/food.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../services/category.service";
import {SurveyService} from "../../services/survey.service";

@Component({
  selector: 'app-admin-food',
  templateUrl: './admin-food.component.html',
  styleUrls: ['./admin-food.component.css']
})
export class AdminFoodComponent implements OnInit {
  foods: Food[];
  categories: Category[];
  surveys;
  categoryForm: FormGroup;
  productForm: FormGroup;

  types = ['Category', 'Food'];
  selected = 'None';

  foodSelected = [];
  categorySelected = [];

  constructor(private foodService: FoodService, private categoryService: CategoryService,
              private surveyService: SurveyService) { }

  ngOnInit() {
    this.initForm();
    this.fetchCategories();
    this.fetchProducts();
    this.fetchSurveys();
  }

  initForm() {
    this.categoryForm = new FormGroup({
      name: new FormControl('', {validators: [Validators.pattern("^[a-zA-Z][a-zA-Z0-9 ]*$")]})
    });

    this.productForm = new FormGroup({
      name: new FormControl('', {validators: [Validators.pattern("^[a-zA-Z][a-zA-Z0-9 ]*$")]}),
      category: new FormControl('')
    })
  }

  fetchCategories() {
    this.categoryService.getCategories();
    this.categoryService.getCategoryListener()
      .subscribe(data=>{
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

  fetchSurveys() {
    this.surveyService.getSurveys();
    this.surveyService.getSurveyListener().subscribe(surveys=>{
      this.surveys = surveys;
    })
  }

  submitCategory() {
    this.categoryService.addCategory(this.categoryForm.value);
    this.categoryForm.reset();
  }

  submitFood() {
    this.foodService.addFood(this.productForm.value);
    this.initForm()
  }

  onFoodSelect(list) {
    this.foodSelected = list.selectedOptions.selected.map(item => item.value);
  }

  onCategorySelect(list) {
    this.categorySelected = list.selectedOptions.selected.map(item => item.value);
  }

  onDelete() {
    if(this.foodSelected.length>0)
      this.foodSelected.map(item => this.foodService.deleteFood(item));
    if(this.categorySelected.length>0)
      this.categorySelected.map(item => this.categoryService.deleteCategory(item));
    this.foodSelected = this.categorySelected = []
  }

}
