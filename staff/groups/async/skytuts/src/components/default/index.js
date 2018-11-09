const defaultData = (course = []) => {
    return  {
        image: `../images/defaultImage${Math.floor((Math.random() * 5) + 1)}.png`,
        title: 'No Title Available',
        subtitle: 'No Subtitle Available',
        short_summary: 'No Summary Available',
        summary: 'No Description Available',
        beginner: course.level === 'beginner',
        intermediate: course.level === 'intermediate' || course.level === '',
        advanced: course.level === 'advanced'
    }
}

export default defaultData
