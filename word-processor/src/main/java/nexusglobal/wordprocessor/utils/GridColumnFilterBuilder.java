package nexusglobal.wordprocessor.utils;

import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.HeaderRow;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.provider.ListDataProvider;
import com.vaadin.flow.data.value.ValueChangeMode;
import com.vaadin.flow.function.SerializablePredicate;
import org.apache.commons.lang3.StringUtils;
import org.vaadin.gatanaso.MultiselectComboBox;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;

public class GridColumnFilterBuilder<T> {

    public static final String FILTER = "Filter";

    private final Grid<T> grid;
    private final HeaderRow filterRow;
    private final List<TextField> filterColumnTextFieldList = new ArrayList<>();
    private final List<ComboBox<?>> filterColumnComboBoxFieldList = new ArrayList<>();
    private final List<MultiselectComboBox<?>> filterColumnMultiSelectComboBoxFieldList = new ArrayList<>();

    public GridColumnFilterBuilder(Grid<T> grid){
        this.grid = grid;
        this.filterRow = this.grid.appendHeaderRow();
        this.grid.getElement().setAttribute("theme", ApmTheme.GRID_HEADER_FILTER);
    }

    private void setFilter(int columnIndex, String columnKey, TextField textfield, SerializablePredicate<T> columnFilter ) {
        textfield.addValueChangeListener(event -> {
            if(this.grid.getDataProvider() instanceof ListDataProvider listDataProvider){
                if (textfield.getValue().equals("")) {
                    listDataProvider.clearFilters();
                } else {
                    listDataProvider.addFilter(columnFilter);
                }
            }
        });
        textfield.setValueChangeMode(ValueChangeMode.EAGER);
        textfield.setSizeFull();
        textfield.setPlaceholder(FILTER);
        this.filterColumnTextFieldList.add(textfield);
        if(columnKey != null && this.grid.getColumnByKey(columnKey) != null){
            this.filterRow.getCell(this.grid.getColumnByKey(columnKey)).setComponent(textfield);
        }else if(this.grid.getColumns().get(columnIndex) != null){
            this.filterRow.getCell(this.grid.getColumns().get(columnIndex)).setComponent(textfield);
        }
    }

    private void setFilter(int columnIndex, String columnKey, ComboBox<?> comboBox, SerializablePredicate<T> columnFilter ) {
        comboBox.addValueChangeListener(event -> {
            if(this.grid.getDataProvider() instanceof ListDataProvider listDataProvider){
                if (comboBox.getOptionalValue().isEmpty()) {
                    listDataProvider.clearFilters();
                } else {
                    listDataProvider.addFilter(columnFilter);
                }
            }
        });

        comboBox.setSizeFull();
        comboBox.setPlaceholder(FILTER);
        this.filterColumnComboBoxFieldList.add(comboBox);
        if(columnKey != null && this.grid.getColumnByKey(columnKey) != null){
            this.filterRow.getCell(this.grid.getColumnByKey(columnKey)).setComponent(comboBox);
        }else if(this.grid.getColumns().get(columnIndex) != null){
            this.filterRow.getCell(this.grid.getColumns().get(columnIndex)).setComponent(comboBox);
        }
    }

    private void setFilter(int columnIndex, String columnKey, MultiselectComboBox<?> multiselectComboBox, SerializablePredicate<T> columnFilter ) {
        multiselectComboBox.addValueChangeListener(event -> {
            if(this.grid.getDataProvider() instanceof ListDataProvider listDataProvider){
                if (multiselectComboBox.getOptionalValue().isEmpty()) {
                    listDataProvider.clearFilters();
                } else {
                    listDataProvider.addFilter(columnFilter);
                }
            }
        });

        multiselectComboBox.setSizeFull();
        multiselectComboBox.setPlaceholder(FILTER);
        this.filterColumnMultiSelectComboBoxFieldList.add(multiselectComboBox);
        if(columnKey != null && this.grid.getColumnByKey(columnKey) != null){
            this.filterRow.getCell(this.grid.getColumnByKey(columnKey)).setComponent(multiselectComboBox);
        }else if(this.grid.getColumns().get(columnIndex) != null){
            this.filterRow.getCell(this.grid.getColumns().get(columnIndex)).setComponent(multiselectComboBox);
        }

    }

    private SerializablePredicate<T> getSerializablePredicate(final TextField textfield, final List<Function<T, String>> functions) {
        return entity -> {
            if (functions.size() > 1) {
                return StringUtils.containsIgnoreCase(functions.get(0).apply(entity), textfield.getValue())
                        || StringUtils.containsIgnoreCase(functions.get(1).apply(entity), textfield.getValue());
            } else {
                return StringUtils.containsIgnoreCase(functions.get(0).apply(entity), textfield.getValue());
            }
        };
    }

    private SerializablePredicate<T> getSerializablePredicate(final TextField textfield, final Function<T, String> function) {
        return entity ->  StringUtils.containsIgnoreCase(function.apply(entity), textfield.getValue());
    }

    private SerializablePredicate<T> getSerializablePredicate(final ComboBox<?> comboBox, final Function<T, ?> function) {
        return entity ->  function.apply(entity).equals(comboBox.getValue());
    }

    private SerializablePredicate<T> getSerializablePredicate(final MultiselectComboBox<?> multiselectComboBox, final Function<T, Collection<?>> function) {
        return entity -> !Collections.disjoint(function.apply(entity), multiselectComboBox.getValue());
    }

    public void clearAllFilters(){
        for (TextField textField: this.filterColumnTextFieldList) {
            textField.clear();
        }
        for (ComboBox<?> comboBox: this.filterColumnComboBoxFieldList) {
            comboBox.clear();
        }
        for (MultiselectComboBox<?> multiselectComboBox: this.filterColumnMultiSelectComboBoxFieldList) {
            multiselectComboBox.clear();
        }
        if(this.grid.getDataProvider() instanceof ListDataProvider listDataProvider){
            listDataProvider.clearFilters();
        }
    }

    public void addFilterColumn(String columnKey, MultiselectComboBox<?> multiselectComboBox, Function<T, Collection<?>> function) {
        SerializablePredicate<T> columnFilter =  getSerializablePredicate(multiselectComboBox, function);
        setFilter(-1, columnKey, multiselectComboBox, columnFilter);
    }

    public void addFilterColumn(int columnIndex, MultiselectComboBox<?> multiselectComboBox, Function<T, Collection<?>> function) {
        SerializablePredicate<T> columnFilter =  getSerializablePredicate(multiselectComboBox, function);
        setFilter(columnIndex, null, multiselectComboBox, columnFilter);
    }

    public void addFilterColumn(String columnKey, ComboBox<?> comboBox, Function<T, ?> function) {
        SerializablePredicate<T> columnFilter =  getSerializablePredicate(comboBox, function);
        setFilter(-1, columnKey, comboBox, columnFilter);
    }

    public void addFilterColumn(int columnIndex, ComboBox<?> comboBox, Function<T, ?> function) {
        SerializablePredicate<T> columnFilter =  getSerializablePredicate(comboBox, function);
        setFilter(columnIndex, null, comboBox, columnFilter);
    }

    public void addFilterColumn(String columnKey, TextField textfield, Function<T, String> function) {
        SerializablePredicate<T> columnFilter =  getSerializablePredicate(textfield, function);
        setFilter(-1, columnKey, textfield, columnFilter);
    }

    public void addFilterColumn(int columnIndex, TextField textfield, Function<T, String> function) {
        SerializablePredicate<T> columnFilter =  getSerializablePredicate(textfield, function);
        setFilter(columnIndex, null, textfield, columnFilter);
    }

    public void addFilterColumn(String columnKey, TextField textfield, List<Function<T, String>> functions) {
        SerializablePredicate<T> columnFilter = getSerializablePredicate(textfield, functions);
        setFilter(-1, columnKey, textfield, columnFilter);
    }

    public void addFilterColumn(int columnIndex, TextField textfield, List<Function<T, String>> functions) {
        SerializablePredicate<T> columnFilter = getSerializablePredicate(textfield, functions);
        setFilter(columnIndex, null, textfield, columnFilter);
    }

}

