import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import * as S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';

import { Credential } from './credential';
import { MessageService } from './message.service';

@Injectable()
export class CredentialService {
  // private _s3:Subject<any> = new Subject<any>();
  // private _s3 = new BehaviorSubject<any>({});
  private _s3;
  private _credentials;
  // public readonly s3: Observable<any> = this._s3.asObservable();
  // public readonly s3 = this._s3.asObservable();
  public readonly s3;
  public readonly credential;
  public readonly credentials;

  constructor(
//    private storage: localStorage,
    private messageService: MessageService
  ) {
    let c = this.getCredential()
    this._s3 = new BehaviorSubject<any>(c);
    this._credentials = new BehaviorSubject<any>([c]);
    this.s3 = this._s3.asObservable();
    this.credential = this._s3.asObservable();
    this.credentials = this._s3.asObservable();

    this.updateAwsCredential(c);
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  getCredential (): Credential {
    let s = JSON.parse(window.localStorage.getItem('credential'));
    if(s) {
      return new Credential(s.access_key_id, s.secret_access_key, s.s3_region, s.s3_bucket);
    } else {
      return new Credential('', '', '', '');
    }
  }

  getAllCredential (): Credential[] {
    let ss = JSON.parse(window.localStorage.getItem('allCredentials'));
    if(ss) {
      return ss.map((s) => {
        return new Credential(s.access_key_id, s.secret_access_key, s.s3_region, s.s3_bucket);
      })
    } else {
      return [new Credential('', '', '', '')];
    }
  }

  updateAwsCredential(c) {
    // AWS.config.update({
    //   credentials: new AWS.Credentials(c.access_key_id, c.secret_access_key)
    // });
    // AWS.config.region = c.s3_region;
    console.log(c);
    this._s3.next(c);
  }

  setCredential(credential) {
    this.updateAwsCredential(credential)
    let c = JSON.stringify(credential);
    console.log(c);
    window.localStorage.setItem('credential', c);
  }

  setAllCredential(credential) {
    this.updateAwsCredential(credential)
    let c = JSON.stringify(credential);
    console.log(c);
    window.localStorage.setItem('allCredentials', c);
  }
}
