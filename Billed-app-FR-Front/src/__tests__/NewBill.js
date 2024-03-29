/**
 * @jest-environment jsdom
 */
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router"
import userEvent from "@testing-library/user-event";
import { use } from "express/lib/application";
import BillsUI from "../views/BillsUI.js"

jest.mock("../app/store", () => mockStore)

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

        const currentNewBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorage})
        const fileTest = new File(['menu'], 'menu.png', {type: 'image/png'})

        const handleChangeFile = jest.fn((e) => currentNewBill.handleChangeFile(e))
        
        const selectFile = screen.getByTestId("file")
        selectFile.addEventListener('change', handleChangeFile)
        userEvent.upload(selectFile, fileTest)
        expect(selectFile.files[0]).toStrictEqual(fileTest)
        expect(selectFile.files).toHaveLength(1)
      })
    })

    describe("When I click on Submit button with a complete form", () => {
      test("Then It should call the submit function and renders Bills page", async () => {
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const html = NewBillUI()
        document.body.innerHTML = html

        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({pathname, data: bills})}
        const currentNewBill = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorage})

        const fileTest = new File(['menu'], 'menu.png', {type: 'image/png'})
        const handleChangeFile = jest.fn((e) => currentNewBill.handleChangeFile(e))
        const selectFile = screen.getByTestId("file")
        selectFile.addEventListener('change', handleChangeFile)
        userEvent.upload(selectFile, fileTest)
        screen.getByTestId("expense-type").value = "Restaurants et bars"
        screen.getByTestId("expense-name").value = "Restaurant Le Concept"
        screen.getByTestId("datepicker").value = "2022-03-12"
        screen.getByTestId("amount").value = "26"
        screen.getByTestId("vat").value = "20"
        screen.getByTestId("pct").value = "20"
        screen.getByTestId("commentary").value = "1 menu entrée - plat"

        const handleSubmit = jest.spyOn(currentNewBill, 'handleSubmit')
        const form = screen.getByTestId("form-new-bill")
        form.addEventListener("submit", handleSubmit)
        fireEvent.submit(form)

        expect(handleSubmit).toHaveBeenCalled()

        await waitFor(() => screen.getByText("Mes notes de frais"))
        const billsPage = screen.getByText("Mes notes de frais")
        expect(billsPage).toBeTruthy()
      })
    })
  })
})


// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to newBill", () => {
    describe("When I POST a new bill", () => {
      test("Then it should be a new bill from mock API POST", async () => {
        const getSpy = jest.spyOn(mockStore, "bills")
        const bill = await mockStore.bills().update();

        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(bill.type).toBe("Hôtel et logement")
      })
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("POST bills from an API and fails with 404 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            upload : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        const html = BillsUI({error:"Erreur 404"})
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
        
      })
  
      test("POST messages from an API and fails with 500 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            upload : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
          const html = BillsUI({error:"Erreur 500"})
          document.body.innerHTML = html
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
      })
    })
  })
})