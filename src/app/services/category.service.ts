import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category, Food} from "../models/food.model";
import {Subject} from "rxjs";
import {FoodService} from "./food.service";

@Injectable({providedIn:'root'})
export class CategoryService {
  private categories: Category[];
  private categoryUpdateListener = new Subject<Category[]>();
  private url = "http://localhost:3000/api/categories/";
  private foodUrl = "http://localhost:3000/api/foods/";

  constructor(private http: HttpClient, private foodService: FoodService){}

  getCategories() {
    this.http.get<{categories: Category[]}>(this.url).subscribe(data => {
      this.categories = data.categories;
      this.categories.sort();
      this.categoryUpdateListener.next([...this.categories])
    })
  }

  getCategoryListener() {
    return this.categoryUpdateListener.asObservable();
  }

  addCategory(category) {
    this.http.post<{category: Category}>(this.url, category).subscribe(newcategory => {
      this.categories = [newcategory.category, ...this.categories];
      this.categories.sort();
      this.categoryUpdateListener.next([...this.categories])
    })
  }

  deleteCategory(id) {
    this.checkFood(id);
    this.http.delete(this.url + id).subscribe(()=>{
      this.categories = this.categories.filter(item => item._id !== id);
      this.categoryUpdateListener.next([...this.categories]);
    })
  }

  checkFood(id) {
    this.http.get<{foods:Food[]}>(this.foodUrl + id).subscribe(data=>{
      if(data.foods.length>0){
        data.foods.map(item => this.foodService.deleteFood(item._id))
      }
    })
  }
}
