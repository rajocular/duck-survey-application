import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Category, Food} from "../models/food.model";

@Injectable({providedIn:'root'})
export class FoodService{
  private url = "http://localhost:3000/api/foods/";
  private foodList: Food[] = [];
  private foodUpdateListener = new Subject<Food[]>();

  constructor(private http: HttpClient) {}

  getFoods() {
    this.http.get<{foods:Food[]}>(this.url).subscribe(data=>{
      this.foodList = data.foods;
      this.foodUpdateListener.next([...this.foodList])
    })
  }

  getFoodListener() {
    return this.foodUpdateListener.asObservable()
  }

  addFood(food) {
    this.http.post<{food: Food}>(this.url, food).subscribe(newFood => {
      this.foodList = [newFood.food, ...this.foodList];
      this.foodList.sort();
      this.foodUpdateListener.next([...this.foodList])
    })
  }

  deleteFood(id) {
    this.http.delete(this.url + id).subscribe(()=>{
      this.foodList = this.foodList.filter(item => item._id !== id)
      this.foodUpdateListener.next([...this.foodList])
    })
  }

}
