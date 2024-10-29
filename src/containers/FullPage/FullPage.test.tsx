import React from "react";
import { render, screen } from "@testing-library/react";
import { TestProvider } from "../../test-utils/test-utils";
import FullPageExtension from "./FullPage";

test("FullPage component", async () => {
  beforeAll(()=>{
    //
    
  })
  const appSdkMock = {
    location: {
      FullPage: {},
    },
  };

  render(<FullPageExtension />, {
    wrapper: ({ children }) => (
      <TestProvider appConfig={{}} appSdk={appSdkMock}>
       <FullPageExtension/>
      </TestProvider>
    ),
  });

  expect(screen.getAllByTitle(/Full Page App/)[0]).toBeInTheDocument();
});
