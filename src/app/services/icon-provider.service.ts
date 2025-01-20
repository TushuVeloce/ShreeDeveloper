import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconProviderService {
  private iconsFolderPath: string = "../../assets/icon";

  public get Save(): string { return `${this.iconsFolderPath}/save.svg`; }
  public get Edit(): string { return `${this.iconsFolderPath}/pencil.svg`; }
  public get Delete(): string { return `${this.iconsFolderPath}/trash.svg`; }
  public get Cancel(): string { return `${this.iconsFolderPath}/close.svg`; }
  public get Add(): string { return `${this.iconsFolderPath}/add.svg`; }
  public get Arrow_Back(): string { return `${this.iconsFolderPath}/arrow-back.svg`; }
  public get Arrow_Forward(): string { return `${this.iconsFolderPath}/arrow-forward.svg`; }
  public get Caret_Forward(): string { return `${this.iconsFolderPath}caret-forward.svg`; }
  public get Caret_Back(): string { return `${this.iconsFolderPath}caret-back.svg`; }

  constructor() {}
}
