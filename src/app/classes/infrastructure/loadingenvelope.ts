import { LoadingController } from "@ionic/angular";
import { UIUtils } from "src/app/services/uiutils.service";

export class LoadingEnvelope
{
    public static PerformProcessWithinLoadingController = async (loadingController: LoadingController, 
        uiUtils: UIUtils, targetMethod: () => void,
        loadingControllerText: string = 'Fetching ...',
        errorDialogHeader: string = 'Error') =>
    {
        let loading = await loadingController.create({message: loadingControllerText});
        await loading.present();

        try
        {
            targetMethod();
            await loading.dismiss();
        }
        catch (err)
        {
            await loading.dismiss();
            await uiUtils.showErrorMessage(errorDialogHeader, err as any);
        }
    }

    public static PerformProcessWithinLoadingControllerAsync = async (loadingController: LoadingController,
        uiUtils: UIUtils, targetMethod: () => Promise<void>,
        loadingControllerText: string = 'Fetching ...',
        errorDialogHeader: string = 'Error') =>
    {
        let loading = await loadingController.create({message: loadingControllerText});
        await loading.present();

        try
        {
            await targetMethod();
            await loading.dismiss();
        }
        catch (err)
        {
            await loading.dismiss();
            await uiUtils.showErrorMessage(errorDialogHeader, err as any);
        }
    }
}