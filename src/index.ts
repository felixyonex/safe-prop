export class SafeProp {
  public val: any;
  public returnEmptyType: string;
  public mode: string;
  constructor(mode?: string, returnEmptyType?: string) {
    switch(mode) {
      case 'safe':
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
    // this.obj = obj;
    this.val = obj;
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
      if (this.mode === 'safe') {
        console.error(errorMsg);
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
    for (const prop of propArr) {
      this.f(prop);
    }
    return this;
  }
}