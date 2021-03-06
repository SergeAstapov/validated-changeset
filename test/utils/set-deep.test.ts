import setDeep from '../../src/utils/set-deep';
import Change from '../../src/-private/change';

describe('Unit | Utility | set deep', () => {
  it('it sets value', () => {
    const objA = { other: 'Ivan' };
    const value = setDeep(objA, 'foo', 'bar');

    expect(value).toEqual({ other: 'Ivan', foo: 'bar' });
  });

  it('it sets deeper', () => {
    const objA = { other: 'Ivan' };
    const value = setDeep(objA, 'other.nick', 'bar');

    expect(value).toEqual({ other: { nick: 'bar' } });
  });

  it('it overrides leaf key', () => {
    const objA = { name: { other: 'Ivan' } };
    const value = setDeep(objA, 'name', 'foo');

    expect(value).toEqual({ name: 'foo' });
  });

  it('it handles nested key', () => {
    const objA = { name: { other: 'Ivan' } };
    const value = setDeep(objA, 'name.other', 'foo');

    expect(value).toEqual({ name: { other: 'foo' } });
  });

  it('it handles sibling keys', () => {
    const objA = { name: { other: 'Ivan', koala: 'bear' }, star: 'wars' };
    const value = setDeep(objA, 'name.other', 'foo');

    expect(value).toEqual({ name: { other: 'foo', koala: 'bear' }, star: 'wars' });
  });

  it('it works with multiple values', () => {
    const objA = { name: { other: 'Ivan' }, foo: { other: 'bar' } };
    const value = setDeep(objA, 'name', 'zoo');

    expect(value).toEqual({ foo: { other: 'bar' }, name: 'zoo' });
  });

  it('it works with nested multiple values', () => {
    const objA = { top: { name: 'jimmy', foo: { other: 'bar' } } };
    const value = setDeep(objA, 'top.name', 'zoo');

    expect(value).toEqual({ top: { foo: { other: 'bar' }, name: 'zoo' } });
  });

  it('it works with nested multiple values with Changes', () => {
    const objA = {
      top: new Change({ name: 'jimmy', foo: { other: 'bar' } })
    };
    const value = setDeep(objA, 'top.name', 'zoo');

    expect(value).toEqual({
      top: new Change({
        foo: { other: 'bar' },
        name: 'zoo'
      })
    });
  });

  it('it works with nested Changes', () => {
    const objA = {
      top: new Change({ name: 'jimmy', foo: { other: 'bar' } })
    };
    const value = setDeep(objA, 'top.name', new Change('zoo'));

    expect(value).toEqual({
      top: new Change({
        foo: { other: 'bar' },
        name: 'zoo' // value is not a Change instance
      })
    });
  });

  it('it works with nested Changes with different order', () => {
    const objA = {
      top: new Change({ foo: { other: 'bar' }, name: 'jimmy' })
    };
    const value = setDeep(objA, 'top.name', new Change('zoo'));

    expect(value).toEqual({
      top: new Change({
        foo: { other: 'bar' },
        name: 'zoo' // value is not a Change instance
      })
    });
  });

  it('set on nested Changes', () => {
    const objA = {
      top: new Change({ foo: { other: 'bar' }, name: 'jimmy' })
    };
    let value = setDeep(objA, 'top.name', new Change('zoo'));

    expect(value).toEqual({
      top: new Change({
        foo: { other: 'bar' },
        name: 'zoo' // value is not a Change instance
      })
    });

    value = setDeep(value, 'top.foo.other', new Change('baz'));

    expect(value).toEqual({
      top: new Change({
        foo: { other: 'baz' },
        name: 'zoo'
      })
    });
  });

  it('set with class instances', () => {
    class Person {
      name = 'baz';
    }
    const objA = {
      top: new Change({ foo: { other: 'bar' }, name: 'jimmy' })
    };
    let value = setDeep(objA, 'top.name', new Change(new Person()));

    expect(value).toEqual({
      top: new Change({
        foo: { other: 'bar' },
        name: new Person()
      })
    });

    class Foo {
      other = 'baz';
    }
    value = setDeep(value, 'top.foo', new Change(new Foo()));

    expect(value).toEqual({
      top: new Change({
        foo: new Foo(),
        name: new Person()
      })
    });
  });
});
