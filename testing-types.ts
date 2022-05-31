class CommandTest {
    public options = new OptionsTest(
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
  Options extends OptionsTest[] = [],
> {
  public options: Options;

  addOption<T extends OptionsTest>(option: T): OptionsTest<[ ...Options, T]> {
    this.options.push(option);
    
    return this as any;
  }
}

class OptionsData<T extends OptionsTest> {
  constructor(public options: T['options']) {}

  get<O extends ExtractValue<T>> (name: O): Extract<ParseOption<T>, { name: O }> {
    return this.options.find(o => o.name === name);
  }
}

const testies = [{ name: 'test' }, { name: 'penis' }] as const;
type oktest = typeof testies[number];

function get<T extends oktest['name']>(name: T): T {
  return this.options.find(o => o.name === name);
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

