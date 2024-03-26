import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {TrolleyManagerService} from "./trolley-manager.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public users = Array<{email: string, isAdmin: boolean, isBanned: boolean, isManager: boolean}>()

  public canLoggedIn = new BehaviorSubject<boolean>(false)
  public canManager = new BehaviorSubject<boolean>(false)
  public canAdmin = new BehaviorSubject<boolean>(false)
  public isBanned = new BehaviorSubject<boolean>(false)

  // public userData = this.angularFireAuth.user

  constructor(
    private trolley: TrolleyManagerService,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.trolley.getUsers().subscribe((users) => {
      this.users = users

      this.angularFireAuth.authState.subscribe((user) => {
        this.canLoggedIn.next(!!user)
        this.canManager.next(!!user && (this.users.find((value) => value.email === user?.email || '')?.isManager || false))
        this.canAdmin.next(!!user && (this.users.find((value) => value.email === user?.email || '')?.isAdmin || false))
        this.isBanned.next(!!user && (this.users.find((value) => value.email === user?.email || '')?.isBanned || false))
      })
    })

    // this.angularFireAuth.authState.subscribe((user) => {
    //   this.canLoggedIn.next(!!user)
    //   this.canManager.next(!!user && (this.users.find((value) => value.email === user?.email || '')?.isManager || false))
    //   this.canAdmin.next(!!user && (this.users.find((value) => value.email === user?.email || '')?.isAdmin || false))
    //   this.isBanned.next(!!user && (this.users.find((value) => value.email === user?.email || '')?.isBanned || false))
    // })

    // this.angularFireAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
    //
    // })
    // setPersistence(this.angularFireAuth, browserSessionPersistence)
  }

  signIn(email: string, password: string) {

    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then((result) => {
      // localStorage.setItem('user', JSON.stringify(result.user))
      return result
    }).catch((error) => {
      console.error(error.message)
      return null
    })

    // this.userData.subscribe((user) => {
    //   alert(JSON.stringify(user))
    // })
  }

  signOut() {
    return this.angularFireAuth.signOut().then(() => {
      // if (localStorage.getItem('user') !== null) {
      //   localStorage.removeItem('user')
      // }

      this.router.navigate(['/login'])
      this.trolley.clearCart()
    })
  }

  register(email: string, password: string) {

    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      return result
    }).catch((error) => {
      console.error(error.message)
      return null
    })
  }

  public CanLoggedIn() {
    return this.canLoggedIn.asObservable()
  }

  public CanManagerIn() {
    return this.canManager.asObservable()
  }

  public CanAdminIn() {
    return this.canAdmin.asObservable()
  }

  public IsBanned() {
    return this.isBanned.asObservable()
  }

  public CanLoggedGo() {
    return this.canLoggedIn.getValue()
  }

  public CanManagerGo() {
    return this.canManager.getValue()
  }

  public CanAdminGo() {
    return this.canAdmin.getValue()
  }

  public getUserEmail() {
    return this.angularFireAuth.user
  }

}
