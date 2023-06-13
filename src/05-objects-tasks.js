/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const rectangle = {};
  rectangle.width = width;
  rectangle.height = height;
  rectangle.getArea = function getArea() {
    return width * height;
  };
  return rectangle;
}


/*
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const data = JSON.parse(json);
  const obj = Object.create(proto);
  return Object.assign(obj, data);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSSelector {
  constructor() {
    this.elementValue = '';
    this.idValue = '';
    this.classValues = [];
    this.attrValues = [];
    this.pseudoClassValues = [];
    this.pseudoElementValue = '';
    this.priority = 0;
  }

  element(value) {
    if (this.elementValue) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.elementValue = value;
    this.checkOrder(1);
    return this;
  }

  id(value) {
    if (this.idValue) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.idValue = value;
    this.checkOrder(2);
    return this;
  }

  class(value) {
    this.classValues.push(value);
    this.checkOrder(3);
    return this;
  }

  attr(value) {
    this.attrValues.push(value);
    this.checkOrder(4);
    return this;
  }

  pseudoClass(value) {
    this.pseudoClassValues.push(value);
    this.checkOrder(5);
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElementValue) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.pseudoElementValue = value;
    this.checkOrder(6);
    return this;
  }

  stringify() {
    let result = '';
    if (this.elementValue) result += `${this.elementValue}`;
    if (this.idValue) result += `#${this.idValue}`;
    if (this.classValues.length > 0) result += `.${this.classValues.join('.')}`;
    if (this.attrValues.length > 0) result += `[${this.attrValues.join('][')}]`;
    if (this.pseudoClassValues.length > 0) result += `:${this.pseudoClassValues.join(':')}`;
    if (this.pseudoElementValue) result += `::${this.pseudoElementValue}`;
    return result;
  }

  checkOrder(priority) {
    if (this.priority <= priority) {
      this.priority = priority;
    } else {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }
}

const cssSelectorBuilder = {
  element(value) {
    const selector = new CSSSelector();
    return selector.element(value);
  },

  id(value) {
    const selector = new CSSSelector();
    return selector.id(value);
  },

  class(value) {
    const selector = new CSSSelector();
    return selector.class(value);
  },

  attr(value) {
    const selector = new CSSSelector();
    return selector.attr(value);
  },

  pseudoClass(value) {
    const selector = new CSSSelector();
    return selector.pseudoClass(value);
  },

  pseudoElement(value) {
    const selector = new CSSSelector();
    return selector.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    const selector = new CSSSelector();
    selector.stringify = () => result;
    return selector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
