/*
 * Copyright 2009-2021 C3 AI (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

import { throwError, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ajax } from '@c3/ui/UiSdlDataRedux';
import { UiSdlActionsObservable, UiSdlStatesObservable, UiSdlReduxAction } from '@c3/types'
import { setCacheKeyAction } from '@c3/ui/UiSdlDataVisionGraph';

export function epic(
  actionStream: UiSdlActionsObservable,
  _stateStream: UiSdlStatesObservable
): UiSdlActionsObservable {
  return actionStream.pipe(
    mergeMap(function (action: UiSdlReduxAction) {
      const {componentId, typeName, actionName, actionArgs = {}} = action.payload;
      return ajax(typeName, actionName, actionArgs, null).pipe(
        mergeMap(function (event: Record<'response', string>) {
          const { response: cacheKey } = event;
          return of(setCacheKeyAction(componentId, cacheKey));
        })
      );
    }),
    catchError(function (e) {
      return throwError(e);
    })
  );
}
