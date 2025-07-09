import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { DataContainerService } from 'src/app/classes/infrastructure/datacontainer.service';
import { Utils } from 'src/app/services/utils.service';
import { RequestTypes } from 'src/app/classes/infrastructure/enums';
import { DataCollection } from 'src/app/classes/infrastructure/datacollection';

export class AttendanceLogCheckInCustomProcess {
    public static readonly CustomProcessRequestType: string = "CheckInCustomRequest";
    public Ref: number = 0;
    public EmployeeRef: number = 0;
    public CompanyRef: number = 0;
    public TransDateTime: string = '';
    public SiteRef: number = 0;
    public TotalWorkingHrs: number = 0;
    public IsLateMark: number = 0;
    public TotalLateMarkHrs: number = 0;
    public IsOverTime: number = 0;
    public TotalOvertimeHrs: number = 0;
    public FirstCheckInTime: string = '';
    public CheckOutTime: string = '';
    public CheckInTime: string = '';
    public LastCheckOutTime: string = '';
    public AttendanceLogPath1: string = '';
    public AttendanceLogPath2: string = '';
    public FromTime: string = '';
    public IsLeave: number = 0;
    public IsHalfDay: number = 0;
    public AttendanceLocationType: number = 0;
    public WorkingHrs: number = 0;
    // public HandleBy: number = 0;
    public CreatedBy: number = 0;
    public UpdatedBy: number = 0;
    public readonly EmployeeName: string = '';
    public readonly SiteName: string = '';
    public readonly CompanyName: string = '';
    public IsCheckIn = false;

    public MergeIntoTransportData = (td: TransportData) => {
        let coll = DataContainerService.GetInstance().GetOrCreateCollection(td.MainData, AttendanceLogCheckInCustomProcess.CustomProcessRequestType) as DataCollection;
        coll.Entries.push(this);
    }

    public FormulateTransportData = () => {
        let td = Utils.GetInstance().CreateNewTransportData(RequestTypes.CustomProcess);
        this.MergeIntoTransportData(td);

        return td;
    }
}
