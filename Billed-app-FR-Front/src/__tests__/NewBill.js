/**
 * @jest-environment jsdom
 */
import {screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import store from "../__mocks__/store.js";
import userEvent from "@testing-library/user-event";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then NewBill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)

    })

    describe("When i click on Choisir un fichier", () => {
      test("Then an image should be added", () => {
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const html = NewBillUI()
        document.body.innerHTML = html
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname})}

        const currentNewBill = new NewBill({document, onNavigate, store: store, localStorage: localStorage})
        const fileTest = new File(['hello'], 'hello.png', {type: 'image/png'})

        const handleChangeFile = jest.fn((e) => currentNewBill.handleChangeFile(e))
        
        const selectFile = screen.getByTestId("file")
        selectFile.addEventListener('change', handleChangeFile)
        userEvent.upload(selectFile, fileTest)
        expect(selectFile.files[0]).toStrictEqual(fileTest)
        expect(selectFile.files.item(0)).toStrictEqual(fileTest)
        expect(selectFile.files).toHaveLength(1)
      })
    })
  })
})
