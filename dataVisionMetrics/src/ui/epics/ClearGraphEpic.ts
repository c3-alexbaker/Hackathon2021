/*
 * Copyright 2009-2021 C3 AI (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

import { throwError, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { receiveDataAction } from '@c3/ui/UiSdlDataRedux';
import { getCollectionDataSourceId } from '@c3/ui/UiSdlConnected';
import { UiSdlActionsObservable, UiSdlStatesObservable, UiSdlReduxAction } from '@c3/types'

type ClearGraphAction = UiSdlReduxAction<{
  componentId: string;
  applicationStateId: string;
}>;

export function epic(
  actionStream: UiSdlActionsObservable,
  _stateStream: UiSdlStatesObservable
): UiSdlActionsObservable {
  return actionStream.pipe(
    mergeMap(function (action: ClearGraphAction) {
      const { payload: { componentId }} = action;
      const dataSourceId: string = getCollectionDataSourceId('dataSpec', componentId);
      return of(
        receiveDataAction(dataSourceId, { nodes: [], edges: [] }),
      )
    }),
    catchError(function (e) {
      return throwError(e);
    })
  );
}
