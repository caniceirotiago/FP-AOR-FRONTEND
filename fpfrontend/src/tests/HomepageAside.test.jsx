import React from 'react';
import { act } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomepageAside from '../components/Asides/HomepageAside';
import useLayoutStore from '../stores/useLayoutStore';
import useTranslationsStore from '../stores/useTranslationsStore';
import '@testing-library/jest-dom';

jest.mock('../stores/useLayoutStore.jsx');
jest.mock('../stores/useTranslationsStore');
jest.mock('react-intl', () => ({
    IntlProvider: ({ children }) => children,
    FormattedMessage: ({ id }) => <span>{id}</span>,
}));
jest.mock('../components/auth regist/ProtectedComponentsByRole', () => ({
    __esModule: true,
    default: ({ children }) => <>{children}</>,
}));

describe('HomepageAside Component Navigation', () => {
    // Mock setup before each test
    beforeEach(() => {
        useLayoutStore.mockReturnValue({
            isAsideExpanded: true,
            toggleAside: jest.fn(),
        });
        useTranslationsStore.mockReturnValue({
            locale: 'en',
        });
    });

    // Reusable function to render component and get getByText
    const renderComponent = () => {
        let getByText;
        act(() => {
            const rendered = render(<Router><HomepageAside /></Router>);
            getByText = rendered.getByText;
        });
        return getByText;
    };

    // Tests for different navigation links
    it('navigates to authenticatedhomepage when clicking the Select Project link', () => {
        const getByText = renderComponent();
        act(() => {
            const link = getByText('selectProject');
            fireEvent.click(link);
        });
        expect(window.location.pathname).toBe('/authenticatedhomepage');
    });

    it('navigates to projectplanning when clicking the Project Planning link', () => {
        const getByText = renderComponent();
        act(() => {
            const link = getByText('projectPlanning');
            fireEvent.click(link);
        });
        expect(window.location.pathname).toBe('/projectplanning');
    });

    it('navigates to messages when clicking the Messages link', () => {
        const getByText = renderComponent();
        act(() => {
            const link = getByText('messages');
            fireEvent.click(link);
        });
        expect(window.location.pathname).toBe('/messages');
    });

    it('navigates to report when clicking the Report link', () => {
        const getByText = renderComponent();
        act(() => {
            const link = getByText('report');
            fireEvent.click(link);
        });
        expect(window.location.pathname).toBe('/report');
    });

    it('navigates to inventory when clicking the Inventory link', () => {
        const getByText = renderComponent();
        act(() => {
            const link = getByText('inventory');
            fireEvent.click(link);
        });
        expect(window.location.pathname).toBe('/inventory');
    });

    it('navigates to settings when clicking the Settings link', () => {
        const getByText = renderComponent();
        act(() => {
            const link = getByText('settings');
            fireEvent.click(link);
        });
        expect(window.location.pathname).toBe('/settings');
    });
});
