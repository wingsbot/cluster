class CommandTest {
    public options = new OptionsTest()
      .addOption({
        name: 'test',
      })
      .addOption({
        name: 'test1',
      })
      .addOption({
        name: 'test2',
      });


  public run({ options }: CommandData<CommandTest>) {
    this.options
    options.get()
  }
}

class OptionsTest<
  Options extends option[] = [],
> {
  public options: Options;

  addOption<T extends option>(option: T): OptionsTest<[ ...Options, T]> {
    this.options.push(option);
    
    return this as any;
  }
}

class OptionsData<T extends OptionsTest> {
  constructor(public options: T['options']) {}

  get<O extends ExtractValue<T>['name']> (name: O): Extract<ParseOption<T>, { name: O }> {
    return this.options.find(o => o.name === name);
  }
}

type option = {
  name: string;
};

type CommandData<T extends CommandTest> = {
  options: OptionsData<T['options']>;
}

type ExtractValue<T extends OptionsTest> =
 T extends OptionsTest<infer O>
      ? O[number]
      : never;
  
type ParseOption<C extends OptionsTest> =
  C extends OptionsTest<infer Name>
    ? {
      name: Name;
    }
    : never;

