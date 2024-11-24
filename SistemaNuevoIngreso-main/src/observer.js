import { student } from "../models/studentModel.js";


class NotificationCenter {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    async notifyObservers(activity, messageType, systemDate) {
        const message = this.createMessage(activity, messageType, systemDate);
        const email = {
            author: "Sistema",
            read: false,
            message: message,
            date: systemDate.toLocaleDateString(),
            hour: `${new Date().getHours()}:${new Date().getMinutes()}`,
        }
        const result = await student.updateMany({}, {
            $push: {buzon: email}
        }, {new: true})
        this.observers.forEach(observer => observer.update(message));
    }

    createMessage(activity, messageType, systemDate) {
        if (messageType === 'publicacion') {
            return `Anuncio: Los invitamos a la actividad ${activity.nombre} el día ${activity.fecha.toLocaleDateString()}.`;
        } else if (messageType === 'recordatorio') {
            const days = activity.fecha.getTime() - systemDate.getTime();
            const daysLeft = Math.ceil(days / (1000 * 60 * 60 * 24));
            return `Recordatorio: La actividad ${activity.nombre} es en ${daysLeft} dias.`;
        } else if(messageType === 'cancelacion'){
            return `Anuncio Importante: La actividad ${activity.nombre} ha sido cancelada`
        }
        return '';
    }
}

class Student {
    constructor(name) {
        this.name = name;
        this.inbox = [];
    }

    update(message) {
        this.inbox.push(message);
        console.log(`Mensaje para ${this.name}: ${message}`);
    }
}

// Exportar las clases
export { NotificationCenter, Student };
