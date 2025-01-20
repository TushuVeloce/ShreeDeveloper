import { Injectable, Output } from '@angular/core';
import { DataContainer } from '../classes/infrastructure/datacontainer';
import { Action2, Action0, Action1 } from '../classes/infrastructure/domain';
import { isNullOrUndefined } from 'util';
import { ServiceInjector } from '../classes/infrastructure/injector';

@Injectable({
  providedIn: 'root'
})
export class AppCommBus {
  public static GetInstance(): AppCommBus {
    return ServiceInjector.AppInjector.get(AppCommBus)
  }

  private m_boundMachineChangedHandlers: Action1<number>[] = [];

  public RegisterBoundMachineChangeHandler(handler: Action1<number>): void {
    this.m_boundMachineChangedHandlers.push(handler);
  }

  public InvokeBoundMachineChangeHandlers(PrintingPressRef: number)
  {
    this.m_boundMachineChangedHandlers.forEach(h => h(PrintingPressRef));
  }

  private m_updationDataHandlers: Action2<DataContainer, string>[] = [];

  public RegisterUpdationDataHandler(handler: Action2<DataContainer, string>): void {
    this.m_updationDataHandlers.push(handler);
  }

  public InvokeUpdationDataHandlers(dc: DataContainer, updatedTableNames: string[]): void {
    updatedTableNames.forEach(tName =>
      {
        this.m_updationDataHandlers.forEach(act => act(dc, tName));
      });
  }

  private m_sidebarOpenCallHandler: Action0 = null as any;

  public RegisterSidebarOpenCallHandler = (value: Action0) =>
  {
    this.m_sidebarOpenCallHandler = value;
  }

  public OpenSidebar = () =>
  {
    if (!isNullOrUndefined(this.m_sidebarOpenCallHandler)) this.m_sidebarOpenCallHandler();
  }
}
