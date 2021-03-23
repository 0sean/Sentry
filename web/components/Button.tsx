export default function Button({ label, ...props }) {
    const { className, secondary, ...unusedProps } = props;
    let classes = "px-3 py-2 shadow-lg rounded-lg text-white transition-colors";
    if(className) {
        classes += ` ${className}`;
    }
    if(secondary) {
        classes += " border hover:border-sentryred hover:text-sentryred";
    } else {
        classes += " bg-sentryred hover:bg-white hover:text-blend";
    }
    return <button className={classes} {...unusedProps} >{label}</button>;
}