/*
 * Copyright 2009-2021 C3 AI (www.c3.ai). All Rights Reserved.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

import { throwError, of, EMPTY } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { tunneledAjax, receiveDataAction } from '@c3/ui/UiSdlDataRedux';
import { applyDataTransforms } from '@c3/ui/WithDataTransforms';
import { DataVisionData } from '@c3/ui/UiSdlTransformInMemoryGraphToDataVisionGraphData';
import {
  ImmutableReduxState,
  getConfigFromState,
  getCollectionDataSourceId,
} from '@c3/ui/UiSdlConnected';
import { UiSdlActionsObservable, UiSdlStatesObservable, UiSdlReduxAction } from '@c3/types'
import { getFormFieldValuesFromState } from '@c3/ui/UiSdlFilterPanel'

type FilterSubmitAction = UiSdlReduxAction<{
  actionName: string;
  componentId: string;
  graphId: string;
  typeName: string;
  value: unknown;
}>

export function epic(
  actionStream: UiSdlActionsObservable,
  stateStream: UiSdlStatesObservable
): UiSdlActionsObservable {
  return actionStream.pipe(
    mergeMap(function (action: FilterSubmitAction) {
      const state = stateStream?.value as ImmutableReduxState;
      const { payload, meta: { siteId } } = action;
      const {
        componentId,
        graphId,
        actionName,
        typeName,
      } = payload;
      const cacheKey: string = getConfigFromState(graphId, state, ['cacheKey']);
      const filterPanelValues: Record<string, any> = getFormFieldValuesFromState(componentId, state);
      const dataSourceId: string = getCollectionDataSourceId('dataSpec', graphId);
      let centerVertex: Record<'id', string> = {id: filterPanelValues?.id?.value};

      return tunneledAjax(
        siteId,
        state,
        actionName,
        typeName,
        {
          centerVertex,
          cacheKey,
        }
      ).pipe(
        mergeMap(function (event) {
          let data = event?.response;
          if (data) {
            const dataVisionData: DataVisionData = applyDataTransforms(['UiSdlTransformInMemoryGraphToDataVisionGraphData'], data);
            return of(
              receiveDataAction(dataSourceId, dataVisionData)
            );
          }
          return EMPTY;
        })
      )
    }),
    catchError(function (e) {
      return throwError(e);
    })
  );
}
