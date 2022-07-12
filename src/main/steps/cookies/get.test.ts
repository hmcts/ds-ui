import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';

import { CookiesGetController } from './get';

describe('CookiesGetController', () => {
  const controller = new CookiesGetController();

  test('Should render the cookie page with adoption service content', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await controller.get(req, res);
  });
});
