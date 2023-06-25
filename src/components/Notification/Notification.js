const notify = (type, ref, text, time) => {
    let dismisTime = 7;
    let msgText = 'Put Text Here ~~'
    if (time) {
        dismisTime = time
    }
    if (text) {
        msgText = text
    }
    let icon;
    switch (type) {
        case 'info':
            icon = 'nc-bulb-63';
            break;
        case 'success':
            icon = 'nc-check-2';
            break;
        case 'danger':
            icon = 'nc-simple-remove';
            break;
        default:
            break;
    }
    let options = {};
    options = {
        place: "br",
        message: (
            <div>
                <div>
                    {msgText}
                </div>
            </div>
        ),
        type: type,
        icon: `nc-icon ${icon}` ,
        autoDismiss: dismisTime,
    };
    ref.current.notificationAlert(options);
};

export default notify;