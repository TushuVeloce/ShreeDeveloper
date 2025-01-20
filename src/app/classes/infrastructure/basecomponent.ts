// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { DataStreamHandlerManagementService } from 'src/app/services/data-services/datastreamhandlermanagement.service';

// @Component({
//   selector: 'app-basecomponent',
//   template: ``,
//   styles: [
//   ]
// })
// export abstract class BaseComponent implements OnInit, OnDestroy {
//     private m_objectInstanceId: number = 0;

//     constructor(protected dataStreamHandlerManagement: DataStreamHandlerManagementService) { 
//         this.m_objectInstanceId = dataStreamHandlerManagement.GenerateNewObjectInstanceId();
//     }

//     async ngOnInit() 
//     {
//         await this.initHook();
//     }

//     async ngOnDestroy() 
//     {
//         await this.dataStreamHandlerManagement.UnregisterAllDataStreamHandlersInObject(this.m_objectInstanceId);
//         await this.destroyHook();
//     }

//     protected abstract initHook(): Promise<void>;
//     protected abstract destroyHook(): Promise<void>;
// }