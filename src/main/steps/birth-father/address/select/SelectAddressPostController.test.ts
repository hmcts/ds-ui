import SelectAddressPostControllerBase from '../../../../app/address/SelectAddressPostControllerBase';
import { FieldPrefix } from '../../../../app/case/case';

import SelectAddressPostController from './SelectAddressPostController';

describe('birth-father > address > select > SelectAddressPostController', () => {
  let controller;

  beforeEach(() => {
    controller = new SelectAddressPostController({});
  });

  test('should extend SelectAddressPostControllerBase', async () => {
    expect(controller).toBeInstanceOf(SelectAddressPostControllerBase);
  });

  test('should call super constructor with correct params', async () => {
    expect(controller.fieldPrefix).toBe(FieldPrefix.BIRTH_FATHER);
  });
});
