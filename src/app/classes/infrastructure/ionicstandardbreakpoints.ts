export enum IonicStandardBreakpoints
{
    xs = 1,
    sm = 2,
    md = 3,
    lg = 4,
    xl = 5
}

export class IonicStandardBreakpointsUtil
{
    public static GetIonicStandardBreakpoint(width: number)
    {
        if (width < 576) return IonicStandardBreakpoints.xs;
        if (width < 768) return IonicStandardBreakpoints.sm;
        if (width < 992) return IonicStandardBreakpoints.md;
        if (width < 1200) return IonicStandardBreakpoints.lg;
        return IonicStandardBreakpoints.xl;
    }
}