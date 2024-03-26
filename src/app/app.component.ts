import {Component, OnInit} from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import {NavigationComponent} from "./navigation/navigation.component";
import {DataService} from "./services/data.service";
import {HttpClientModule} from "@angular/common/http";
import {TrolleyManagerService} from "./services/trolley-manager.service";
import {CurrencyManagerService} from "./services/currency-manager.service";
import {AngularFireModule, FIREBASE_OPTIONS} from "@angular/fire/compat";
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {DatabaseModule, getDatabase, provideDatabase} from "@angular/fire/database";
import {FirebaseApp} from "@angular/fire/app";
import {environment} from "../environments/enviorment";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgbAlert,
    NavigationComponent,
    AngularFireModule,
    DatabaseModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    // AngularFireDatabaseModule,
    DataService,
    HttpClientModule,
    TrolleyManagerService,
    CurrencyManagerService,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor() {

  }

  public ngOnInit() {
    // const testCollection = collection(
    //   this.firestore,
    //   'test',
    // )
    // addDoc(testCollection, {
    //   test: 'test',
    //   text: " I love firebase"
    // })

  }


}
