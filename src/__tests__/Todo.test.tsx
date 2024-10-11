import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '../components/pages/Todo';
import { ConfirmDialogProvider } from '../components/ui/ConfirmDialog';
import { InputDialogProvider } from '../components/ui/InputDialog';
import { MemoryRouter } from "react-router-dom";

describe('Todo component', () => {
    beforeEach(() => {
        localStorage.clear(); 
    });

    test('создание новой задачи', () => {
        render(
            <MemoryRouter>
                <ConfirmDialogProvider>
                    <InputDialogProvider>
                        <Todo />
                    </InputDialogProvider>
            </ConfirmDialogProvider>
            </MemoryRouter>
        );

        const inputElement = screen.getByPlaceholderText('Добавьте новую задачу');
        fireEvent.change(inputElement, { target: { value: 'Новая задача' } });

        const addButton = screen.getByText('Добавить');
        fireEvent.click(addButton);

        const newTaskElement = screen.getByText('Новая задача');
        expect(newTaskElement).toBeInTheDocument();
    });

    test('удаление задачи', () => {
        render(
            <MemoryRouter>
                <ConfirmDialogProvider>
                    <InputDialogProvider>
                        <Todo />
                    </InputDialogProvider>
                </ConfirmDialogProvider>
            </MemoryRouter>
        );

        const inputElement = screen.getByPlaceholderText('Добавьте новую задачу');
        fireEvent.change(inputElement, { target: { value: 'Задача для удаления' } });
        const addButton = screen.getByText('Добавить');
        fireEvent.click(addButton);

        const deleteButton = screen.getAllByText('delete')[0];
        fireEvent.click(deleteButton);

        const confirmDeleteButton = screen.getByText('Удалить');
        fireEvent.click(confirmDeleteButton);

        const deletedTask = screen.queryByText('Задача для удаления');
        expect(deletedTask).not.toBeInTheDocument();
    });

    test('редактирование задачи', () => {
        render(
            <MemoryRouter>
                <ConfirmDialogProvider>
                    <InputDialogProvider>
                        <Todo />
                    </InputDialogProvider>
                </ConfirmDialogProvider>
            </MemoryRouter>
        );

        const inputElement = screen.getByPlaceholderText('Добавьте новую задачу');
        fireEvent.change(inputElement, { target: { value: 'Задача для редактирования' } });
        const addButton = screen.getByText('Добавить');
        fireEvent.click(addButton);

        const editButton = screen.getAllByText('edit')[0];
        fireEvent.click(editButton);

        const editInput = screen.getByDisplayValue('Задача для редактирования');
        fireEvent.change(editInput, { target: { value: 'Обновленная задача' } });


        const saveButton = screen.getByText('Сохранить');
        fireEvent.click(saveButton);

        const updatedTask = screen.getByText('Обновленная задача');
        expect(updatedTask).toBeInTheDocument();
    });
});
