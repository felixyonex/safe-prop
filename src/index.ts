export class SafeProp {
  public val: any;
  private obj: object;
  private mode: string;
  constructor(mode?: string) {
    if (mode === 'safe') {
      this.mode = mode;
    } else {
      this.mode = 'default';
    }
  }

  // wrap the object
  public set(obj: object) {
    this.obj = obj;
    this.val = obj;
    return this;
  }

  // fetch the value from property name
  public f(prop: string) {
    if (this.obj === undefined) {
      if (this.mode === 'safe') {
        this.val = undefined;
        return this;
      } else {
        throw new Error(`safeProp Error: Cannot read property ${prop} from undefined!`)
      }
    }
    this.val = this.obj[prop];
    this.obj = this.obj[prop]
    return this;
  }

  // fetch value from a chain of properties
  // eg. 'request.body.message'
  public get(propChain: string) {
    if (this.obj === undefined) {
      if (this.mode === 'safe') {
        this.val = undefined;
        return this;
      } else {
        throw new Error(`safeProp Error: Cannot read property ${propChain} from undefined!`)
      }
    }
    const propArr = propChain.split('.');
    propArr.map((prop) => {this.f(prop);})
    return this;
  }
}