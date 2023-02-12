const getMonthAndYear = (date)=>{
    return {
        month:new Date(date).getMonth(),
        year:new Date(date).getFullYear()
    }
}

export default getMonthAndYear;