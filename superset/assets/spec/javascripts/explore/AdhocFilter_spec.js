import AdhocFilter, { EXPRESSION_TYPES, CLAUSES } from '../../../src/explore/AdhocFilter';

describe('AdhocFilter', () => {
  it('sets filterOptionName in constructor', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: CLAUSES.WHERE,
    });
    expect(adhocFilter.filterOptionName.length).toBeGreaterThan(10);
    expect(adhocFilter).toEqual({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: CLAUSES.WHERE,
      filterOptionName: adhocFilter.filterOptionName,
      sqlExpression: null,
      fromFormData: false,
    });
  });

  it('can create altered duplicates', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: CLAUSES.WHERE,
    });
    const adhocFilter2 = adhocFilter1.duplicateWith({ operator: '<' });

    expect(adhocFilter1.subject).toBe(adhocFilter2.subject);
    expect(adhocFilter1.comparator).toBe(adhocFilter2.comparator);
    expect(adhocFilter1.clause).toBe(adhocFilter2.clause);
    expect(adhocFilter1.expressionType).toBe(adhocFilter2.expressionType);

    expect(adhocFilter1.operator).toBe('>');
    expect(adhocFilter2.operator).toBe('<');
  });

  it('can verify equality', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: CLAUSES.WHERE,
    });
    const adhocFilter2 = adhocFilter1.duplicateWith({});

    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1.equals(adhocFilter2)).toBe(true);
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1 === adhocFilter2).toBe(false);
  });

  it('can verify inequality', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: CLAUSES.WHERE,
    });
    const adhocFilter2 = adhocFilter1.duplicateWith({ operator: '<' });

    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1.equals(adhocFilter2)).toBe(false);

    const adhocFilter3 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SQL,
      sqlExpression: 'value > 10',
      clause: CLAUSES.WHERE,
    });
    const adhocFilter4 = adhocFilter3.duplicateWith({ sqlExpression: 'value = 5' });

    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter3.equals(adhocFilter4)).toBe(false);
  });

  it('can determine if it is valid', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: CLAUSES.WHERE,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1.isValid()).toBe(true);

    const adhocFilter2 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '>',
      comparator: null,
      clause: CLAUSES.WHERE,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter2.isValid()).toBe(false);

    const adhocFilter3 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SQL,
      sqlExpression: 'some expression',
      clause: null,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter3.isValid()).toBe(false);

    const adhocFilter4 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: 'in',
      comparator: [],
      clause: CLAUSES.WHERE,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter4.isValid()).toBe(false);

    const adhocFilter5 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: 'in',
      comparator: ['val1'],
      clause: CLAUSES.WHERE,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter5.isValid()).toBe(true);
  });

  it('can translate from simple expressions to sql expressions', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'value',
      operator: '==',
      comparator: '10',
      clause: CLAUSES.WHERE,
    });
    expect(adhocFilter1.translateToSql()).toBe('value = 10');

    const adhocFilter2 = new AdhocFilter({
      expressionType: EXPRESSION_TYPES.SIMPLE,
      subject: 'SUM(value)',
      operator: '!=',
      comparator: '5',
      clause: CLAUSES.HAVING,
    });
    expect(adhocFilter2.translateToSql()).toBe('SUM(value) <> 5');
  });
});
