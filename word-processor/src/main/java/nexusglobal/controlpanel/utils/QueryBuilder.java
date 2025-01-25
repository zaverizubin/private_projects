package nexusglobal.controlpanel.utils;

import javax.persistence.criteria.*;
import javax.persistence.criteria.CriteriaBuilder.Coalesce;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SuppressWarnings({"rawtypes", "unchecked"})
public class QueryBuilder<T, S> {
    public final CriteriaBuilder cb;
    private final CriteriaQuery<S> query;
    private final Root<T> root;
    private final List<Predicate> where = new ArrayList<>();
    private final List<Order> orders = new ArrayList<>();
    private final List<Selection<?>> selections = new ArrayList<>();
    private Selection<S> selection;

    public QueryBuilder(final CriteriaBuilder cb, final Class<T> fromClass, final Class<S> resultClass) {
        this.cb = cb;
        this.query = cb.createQuery(resultClass);
        this.root = this.query.from(fromClass);
    }

    public <U, V> QueryBuilder<T, S> asc(final Join<T, U> join, final SingularAttribute<? super U, V> property) {
        this.orders.add(this.cb.asc(join.get(property)));
        return this;
    }

    public QueryBuilder<T, S> asc(final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        this.orders.add(this.cb.asc(path));
        return this;
    }

    public QueryBuilder<T, S> between(final LocalDate fromDate, final LocalDate toDate, final SingularAttribute<? super T, LocalDate>... properties) {
        final Coalesce<LocalDate> coalesce = this.cb.coalesce();
        for (final SingularAttribute<? super T, LocalDate> property : properties) {
            coalesce.value(get(property));
        }
        this.where.add(this.cb.between(coalesce, fromDate, toDate));
        return this;
    }

    public CriteriaQuery<S> build() {
        this.query.where(this.where.toArray(new Predicate[0]));
        this.query.orderBy(this.orders);

        if (this.selection != null) {
            this.query.select(this.selection);
        } else if (!this.selections.isEmpty()) {
            this.query.multiselect(this.selections);
        }

        return this.query;
    }

    public Expression<Long> count(final Expression<?> expression) {
        return this.cb.count(expression);
    }

    public CriteriaQuery<S> criteriaQuery() {
        return this.query;
    }

    public <U> QueryBuilder<T, S> desc(final SingularAttribute<? super T, U> property) {
        this.orders.add(this.cb.desc(get(property)));
        return this;
    }

    public QueryBuilder<T, S> distinct() {
        this.query.distinct(true);
        return this;
    }

    public QueryBuilder<T, S> eq(final Object value, final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        if (value == null) {
            this.where.add(this.cb.isNull(path));
        } else {
            this.where.add(this.cb.equal(path, value));
        }
        return this;
    }

    public <U extends Comparable<? super U>> QueryBuilder<T, S> ge(final SingularAttribute<? super T, U> property, final U value) {
        this.where.add(this.cb.greaterThanOrEqualTo(get(property), value));
        return this;
    }

    public <U> Expression<U> get(final SingularAttribute<? super T, U> property) {
        return this.root.get(property);
    }

    public QueryBuilder<T, S> groupBy(final Expression<?> expression) {
        this.query.groupBy(expression);
        return this;
    }

    public QueryBuilder<T, S> groupBy(final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        this.query.groupBy(path);
        return this;
    }

    public QueryBuilder<T, S> in(final List<?> values, final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        this.where.add(path.in(values));
        return this;
    }

    public QueryBuilder<T, S> isMember(final Object value, final SetAttribute setAttribute) {
        if (value != null) {
            this.where.add(this.cb.isMember(value, this.root.get(setAttribute)));
        }
        return this;
    }

    public <U, V> Join<U, V> join(final Join<T, U> join, final SingularAttribute<U, V> property) {
        return join.join(property);
    }

    public <U> Join<T, U> join(final ListAttribute<? super T, U> property) {
        return this.root.join(property);
    }

    public <U> Join<T, U> join(final ListAttribute<? super T, U> property, final JoinType joinType) {
        return this.root.join(property, joinType);
    }

    public <U> Join<T, U> join(final SingularAttribute<? super T, U> property) {
        return this.root.join(property);
    }

    public <U> Join<T, U> join(final SingularAttribute<? super T, U> property, final JoinType joinType) {
        return this.root.join(property, joinType);
    }

    public QueryBuilder<T, S> max(final SingularAttribute<? super T, ? extends Number> property) {
        this.selections.add(this.cb.max(get(property)));
        return this;
    }

    public QueryBuilder<T, S> multiselect(final Selection<?>... selections) {
        this.selections.addAll(Arrays.asList(selections));
        return this;
    }

    public QueryBuilder<T, S> multiselect(final SingularAttribute<? super T, ?>... attributes) {

        for (final SingularAttribute<? super T, ?> attribute : attributes) {
            this.selections.add(get(attribute));
        }
        return this;
    }

    public QueryBuilder<T, S> notEqual(final Object value, final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        if (value == null) {
            this.where.add(this.cb.isNotNull(path));
        } else {
            this.where.add(this.cb.notEqual(path, value));
        }
        return this;
    }

    public Root<T> root() {
        return this.root;
    }

    public QueryBuilder<T, S> select(final Selection<S> selection) {
        this.selection = selection;
        return this;
    }

    public QueryBuilder<T, S> select(final SingularAttribute<? super T, S> attribute) {
        this.selection = get(attribute);
        return this;
    }

    public QueryBuilder<T, S> select(final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        this.selection = path;
        return this;
    }

    public Expression<Long> sum(final SingularAttribute<? super T, ?> rootAttribute, final SingularAttribute<?, ?>... attributes) {
        Path path = this.root.get(rootAttribute);
        for (final SingularAttribute<?, ?> attribute : attributes) {
            path = path.get(attribute);
        }
        return this.cb.sum(path);
    }

    public QueryBuilder<T, S> fetch(final SingularAttribute<? super T, ?> fetchedAttribute, final JoinType joinType) {

        this.root.fetch(fetchedAttribute, joinType);

        return this;
    }

    public QueryBuilder<T, S> fetch(final SetAttribute<? super T, ?> fetchedAttribute, final JoinType joinType) {

        this.root.fetch(fetchedAttribute, joinType);

        return this;
    }

    public QueryBuilder<T, S> fetch(final ListAttribute<? super T, ?> fetchedAttribute, final JoinType joinType) {

        this.root.fetch(fetchedAttribute, joinType);

        return this;
    }
}