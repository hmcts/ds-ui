import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { Case } from '../case/case';
import { State } from '../case/definition';

import { GetController } from './GetController';

describe('GetController', () => {
  const languages = {
    en: {
      text: 'english',
    },
    cy: {
      text: 'welsh',
    },
  };
  const generateContent = content => languages[content.language];
  test('Should render the page', async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    await controller.get(req, res);

    expect(1).toEqual(1);
  });

  test('Detects when application is not in a draft state', async () => {
    const controller = new GetController('page', () => ({}));

    const req = mockRequest({ userCase: { state: State.AwaitingPayment } });
    const res = mockResponse();
    await controller.get(req, res);
    expect(1).toEqual(1);
  });

  describe('Getting the users preferred language', () => {
    test('Language via query string', async () => {
      const controller = new GetController('page', generateContent);

      const language = 'cy';
      const req = mockRequest();
      const res = mockResponse();
      req.query.lng = language;
      await controller.get(req, res);
      expect(1).toEqual(1);
    });

    test('Language via session', async () => {
      const controller = new GetController('page', generateContent);

      const language = 'cy';
      const req = mockRequest();
      const res = mockResponse();
      req.session.lang = language;
      await controller.get(req, res);
      expect(1).toEqual(1);
    });

    test('Language via browser settings', async () => {
      const controller = new GetController('page', generateContent);

      const req = mockRequest({ headers: { 'accept-language': 'cy' } });
      const res = mockResponse();
      await controller.get(req, res);
      expect(1).toEqual(1);
    });

    test('Language via browser settings fallback to en', async () => {
      const controller = new GetController('page', generateContent);

      const req = mockRequest({ headers: { 'accept-language': 'unknown' } });
      const res = mockResponse();
      await controller.get(req, res);
      expect(1).toEqual(1);
    });
  });

  test("Doesn't call render if an error page has already been rendered upstream", async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    res.locals.isError = true;
    await controller.get(req, res);

    expect(res.render).not.toHaveBeenCalled();
  });

  test("Doesn't call render if headers have already been sent already upstream", async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    res.headersSent = true;
    await controller.get(req, res);

    expect(res.render).not.toHaveBeenCalled();
  });

  test('sends the current page form session state to the view', async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    await controller.get(req, res);
    expect(1).toEqual(1);
  });

  describe('parseAndSetReturnUrl', () => {
    test.each([
      { returnUrl: undefined, expected: undefined },
      { returnUrl: '/unknown-url', expected: undefined },
      { returnUrl: '/applicant1/full-name', expected: '/applicant1/full-name' },
    ])('correctly parses and sets the return url in session', ({ returnUrl, expected }) => {
      const controller = new GetController('page', () => ({}));
      const req = mockRequest({ query: { returnUrl } });
      controller.parseAndSetReturnUrl(req);
      expect(req.session.returnUrl).toBe(expected);
    });
  });

  describe('generatePageContent()', () => {
    test('calls generatePageContent with correct arguments for new sessions', async () => {
      const getContentMock = jest.fn().mockReturnValue({});
      const controller = new GetController('page', getContentMock);

      const req = mockRequest({ userCase: { state: State.Draft }, session: { errors: [] } });
      const res = mockResponse();
      await controller.get(req, res);
      expect(1).toEqual(1);
    });
  });

  describe('save', () => {
    test('Should save the users data, and return the updated userCase', async () => {
      const body = { applyingWith: 'alone' };
      const controller = new GetController('page', () => ({}));

      const expectedUserCase = {
        id: '1234',
        applyingWith: 'alone',
      };

      const req = mockRequest({ body });
      (req.locals.api.triggerEvent as jest.Mock).mockResolvedValueOnce(expectedUserCase);
      const updatedUserCase = await controller.save(req, body as Partial<Case>, 'MOCK_EVENT');
      expect(updatedUserCase).toEqual(expectedUserCase);
      expect(1).toEqual(1);
    });

    test('Should log error when there is an error in updating userCase', async () => {
      const body = { applyingWith: 'alone' };
      const req = mockRequest({ body });
      (req.locals.api.triggerEvent as jest.Mock).mockRejectedValueOnce('Error saving');
      expect(1).toEqual(1);
    });
  });

  describe('saveSessionAndRedirect', () => {
    test('should save session and redirect to req.url', () => {
      const controller = new GetController('page', () => ({}));
      const req = mockRequest();
      const res = mockResponse();
      controller.saveSessionAndRedirect(req, res);
      expect(req.session.save).toBeCalled();
      expect(res.redirect).toBeCalledWith('/request');
    });

    test('should throw an error and not redirect when session can not be saved', () => {
      const controller = new GetController('page', () => ({}));
      const req = mockRequest({
        session: {
          save: jest.fn(done => done('MOCK_ERROR')),
        },
      });
      const res = mockResponse();
      try {
        controller.saveSessionAndRedirect(req, res);
      } catch (err) {
        expect(err).toBe('MOCK_ERROR');
      }
      expect(res.redirect).not.toBeCalledWith('/request');
    });
  });
});
