import {
  DraftedSchemaOptionsFactory,
  JSONErrorListValidationParser
} from "../src/index"
import {
  Draft2019
} from 'json-schema-library'

describe("DraftedSchemaOptionsFactory", () => {
  const optionsFactory = new DraftedSchemaOptionsFactory(
    new Draft2019()
  )
  describe("process", () => {
    test("handle type constraints", () => {
      const options = optionsFactory.process({
        oneOf: [
          { type: 'number' },
          { type: 'string' }
        ]
      })
      expect(options.length).toBe(2)
      expect(options[0].value.validate(true).length).toBe(1)
      expect(options[0].value.coerce?.('3')).toBe(3)
    })
  })
})

describe("JSONErrorListValidationParser", () => {
  const draft = new Draft2019()
  const parser = new JSONErrorListValidationParser()
  describe("rateValidity", () => {
    test("should check error count", () => {
      const validation = draft.validate(
        -1,
        { type: 'number', minimum: 0 }
      )
      const rating = parser.rateValidity(validation)
      expect(rating).toBe(0)
    })
    test("should prioritize type errors", () => {
      const validation = draft.validate(
        1,
        { type: 'string' }
      )
      //expect(validation).toBe(0)
      const rating = parser.rateValidity(validation)
      expect(rating).toBe(-9)
    })
    test("should downplay content error weight", () => {
      const validation = draft.validate(
        { x: null },
        {
          properties: {
            x: { type: 'number' }
          }
        }
      )
      const rating = parser.rateValidity(validation)
      expect(rating).toBe(-4)
    })
    test("should stack error values", () => {
      const validation = draft.validate(
        -1,
        { type: 'number', minimum: 0 , multipleOf: 2 }
      )
      const rating = parser.rateValidity(validation)
      expect(rating).toBe(-1)
    })
  })
})