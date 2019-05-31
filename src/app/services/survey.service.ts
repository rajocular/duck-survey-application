import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Survey} from "../models/survey.model";
import {Subject} from "rxjs";

@Injectable({providedIn:"root"})
export class SurveyService{
  private url = "http://localhost:3000/api/surveys/";
  private surveys = [];
  private surveyUpdateListener = new Subject();

  constructor(private http: HttpClient){}

  getSurveys() {
    this.http.get<{count: number, surveys: any[]}>(this.url).subscribe(data=>{
      this.surveys = data.surveys;
      this.surveyUpdateListener.next([...this.surveys])
    })
  }

  getSurveyListener(){
    return this.surveyUpdateListener.asObservable();
  }

  addSurvey(surveyData: Survey) {
    this.http.post<{message: string}>(this.url, surveyData).subscribe((data)=>{
      this.surveyUpdateListener.next(data.message)
    })
  }

  getData(type: string){
    return this.http.get<{list: string[]}>(this.url+type)
  }

}
