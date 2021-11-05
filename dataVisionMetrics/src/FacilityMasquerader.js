function evalMetric(spec) {
    MetricInfoPoint.create({
        type: 'Facility',
        entityId: spec.id,
        user: User.myUser().groups[0].id,
        granularity: spec.interval,
        start: spec.start,
        end: spec.end,
        metric: MetricInfo.get(spec.expression)
    })

    return Facility.evalMetric(spec);
}

function evalMetrics(spec) { 
    const userGroup = User.myUser().groups[0].id;
    spec.ids.forEach(id => {
        spec.expressions.forEach(expression => {
            MetricInfoPoint.create({
                type: 'Factility',
                entityId: id,
                user: userGroup,
                granularity: spec.interval,
                start: spec.start,
                end: spec.end,
                metric: MetricInfo.get(expression)
            })
        }) 
    })


    return Facility.evalMetrics(spec);
}
