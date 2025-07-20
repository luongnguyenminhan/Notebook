// import '@testing-library/jest-dom'
// import { render, screen } from '@testing-library/react'
// import HomePage from '@/app/page'
// import { NextIntlClientProvider } from 'next-intl'
// import { ReactQueryProvider } from '@/context/ReactQueryProvider'
// import { Provider } from 'react-redux'
// import store from '@/store/index'

// const messages = { HomePage: { title: 'Home Page' } }

// function renderWithProviders(ui: React.ReactElement) {
//   return render(
//     <Provider store={store}>
//       <ReactQueryProvider>
//         <NextIntlClientProvider locale="en" messages={messages}>
//           {ui}
//         </NextIntlClientProvider>
//       </ReactQueryProvider>
//     </Provider>
//   )
// }

// describe('Page', () => {
//   it('renders a heading', () => {
//     renderWithProviders(<HomePage />)

//     const heading = screen.getByTestId('homepage-title')
//     expect(heading).toBeInTheDocument()
//   })
// })
