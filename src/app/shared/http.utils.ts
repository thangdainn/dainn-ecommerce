import { HttpParams } from '@angular/common/http';

export function createParams(paramsObj: { [key: string]: any }): HttpParams {
  let params = new HttpParams();
  for (const key in paramsObj) {
    const value = paramsObj[key];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params = params.set(key, value.join(','));
        }
      } else {
        params = params.set(key, value.toString());
      }
    }
  }
  return params;
}

export function createParamsNonArray(paramsObj: { [key: string]: any }): HttpParams {
    let params = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj[key] !== undefined && paramsObj[key] !== null) {
        params = params.set(key, paramsObj[key]);
      }
    }
    return params;
  }