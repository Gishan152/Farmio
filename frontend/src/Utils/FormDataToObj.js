export const FormDataToObj = (formData) => {
    const entries = formData.entries();
    const array = Array.from(entries);
    const obj = {}
    array.forEach(entry=>{
        obj[entry[0]] = entry[1];
    })
    return obj;
}