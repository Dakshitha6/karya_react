export const stringValidation = (input) => {
    // Check if the string is not empty and has only alphanumeric characters along with a few special characters
    // if(input && /^[a-zA-Z0-9\-\&\%\'\.\!\s]+$/.test(input)){
    //     return true;
    // }else{
    //     return false;
    // }
    return (input && /^[^<>]+$/.test(input));
}

export const INVALID_STRING_MESSAGE = "Special characters like <, > are not allowed";

export const URLvalidator = (url) => {
    //const regex = /^((https?):\/\/)(www\.)?[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/gm;
    // const regex = /^((https?):\/\/)(www\.)?[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)?[\w#\-\s\.]+)*((\/[\w\-\+\%\s#])*\?[a-zA-Z0-9_]+=[\w\-\+\%\s]+(&[a-zA-Z0-9_]+=[\w\-\+\%\s]+)*)?[\w\-\+\%\s#]*\/?$/gm;
    // const regex = /^((https?):\/\/)(www\.)?[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+.*$/gm;
    const regex = /^((https?):\/\/)(www\.)?[a-zA-Z0-9_-]{1,63}(\.[a-zA-Z]{2,6})+.*$/gm;

    return regex.test(url);
}