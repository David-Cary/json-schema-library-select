import {
  DraftedSchemaOptionsFactory
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