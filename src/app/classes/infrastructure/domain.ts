export interface Action0 {
  (): void;
}

export interface Action1<T> {
  (arg: T): void;
}

export interface Action2<T1, T2> {
  (arg1: T1, arg2: T2): void;
}

export interface Promise_0 {
  (): Promise<void>;
}

export interface Promise_1<T> {
  (arg: T): Promise<void>;
}

export interface Promise_2<T1, T2> {
  (arg1: T1, arg2: T2): Promise<void>;
}
