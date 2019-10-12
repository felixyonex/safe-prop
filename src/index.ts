export class SafeProp {
  public val: any;
  public returnEmptyType: string;
  public mode: string;
  private logEnabled = true;
  constructor(mode?: string, returnEmptyType?: string) {
    switch(mode) {
      case 'log':
      case 'strict':
        this.mode = mode;
        break;
      default: 
        this.mode = 'default';
    }
    switch(returnEmptyType) {
      case 'generic':
      case 'null':
        this.returnEmptyType = returnEmptyType;
        break;
      default: 
        this.returnEmptyType = 'undefined'
    }
  }

  // wrap the object
  public set(obj: object) {
    this.val = obj;
    this.logEnabled = true;
    return this;
  }

  // fetch the value from property name
  public f(prop: string) {
    if (this.val === undefined || this.val === null) {
      const emptyType = this.val === undefined ? 'undefined' : 'null';
      const errorMsg = `safeProp Error: Cannot read property ${prop} of ${emptyType}!`;

      // if the returnEmptyType is specified, set value to that type; if not, return itself
      this.val = this.returnEmptyType === 'undefined' ? undefined :
        this.returnEmptyType === 'null' ? null :
          this.val;

      if (this.mode === 'strict') {
        throw new Error(errorMsg);
      }
      if (this.mode === 'log' && this.logEnabled) {
        console.error(errorMsg);
        this.logEnabled = false;
      }
      return this;
    }
    this.val = this.val[prop];
    return this;
  }

  // fetch value from a chain of properties
  // eg. 'request.body.message'
  public get(propChain: string) {
    const propArr = propChain.split('.');
    this.logEnabled = true;
    for (const prop of propArr) {
      this.f(prop);
    }
    return this;
  }
}