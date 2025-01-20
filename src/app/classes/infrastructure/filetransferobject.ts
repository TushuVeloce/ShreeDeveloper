export class FileTransferObject {
  public id: string = '';
  public rawFile: string | File = '';
  public name: string = '';

  private static m_fileId: number = 0;

  public static FromFile(id: string, file: File, name: string) {
    let result = new FileTransferObject();
    result.id = id;
    result.rawFile = file;
    result.name = name;

    return result;
  }

  public static FromFileWithoutId(file: File, name: string) {
    this.m_fileId++;
    let fileId = `file_${this.m_fileId}`;

    return FileTransferObject.FromFile(fileId, file, name);
  }
}
