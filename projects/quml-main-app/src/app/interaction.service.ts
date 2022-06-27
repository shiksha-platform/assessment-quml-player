import { Observable, throwError as observableThrowError, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class InteractionService {
  private params: any = {};
  private authToken: string = "";
  private baseUrl = "http://167.71.236.219:5001/v1/graphql";
  private httpOptions = (authToken) => {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };
  };
  constructor(private http: HttpClient) {}

  initializeParams(params) {
    this.params = params;
  }

  submitScores(requestData): Observable<any> {
    const stringifyBody = JSON.stringify(requestData);
    const body = {
      query: `mutation ($body: String){insert_quml_response(objects: {body: $body}) { returning {id}}}`,
      variables: { body: stringifyBody },
    };
    return this.http.post(`${this.baseUrl}`, body, this.httpOptions(this.params.authToken)).pipe(
      mergeMap((data: any) => {
        console.log("\ndata is", data, "\n\n");
        if (data) {
          return of(data);
        } else {
          return observableThrowError({ error: "Data Missing" });
        }
      })
    );
  }
}
