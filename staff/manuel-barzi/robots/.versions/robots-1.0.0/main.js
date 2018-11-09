/**
 * Robot abstraction
 * 
 * @param {string} id The id of the DOM element associated to this component
 */
function Robot(id) {
    Part.call(this, id);

    var base = new Part('base');
    base.color = 'khaki';
    base.width = 40;
    base.height = 40;

    var arm = new Part('arm');
    arm.color = 'plum';
    arm.width = 20;
    arm.height = 100;
    arm.x = (base.width - arm.width) / 2;
    arm.y = base.height;

    base.add(arm);

    this.arm = arm;

    var forearm = new Part('forearm');
    forearm.color = 'skyblue';
    forearm.width = 20;
    forearm.height = 100;
    forearm.y = 100;

    arm.add(forearm);

    this.forearm = forearm;

    var gripper = new Part('gripper');
    gripper.color = 'orange';
    gripper.width = 50;
    gripper.height = 20;
    gripper.y = forearm.height;
    gripper.x = (forearm.width - gripper.width) / 2;

    forearm.add(gripper);

    this.gripper = gripper;

    var fingers = [new Part('finger1'), new Part('finger2')];
    fingers.forEach(function (finger, index) {
        finger.color = 'yellowgreen';
        finger.width = 10;
        finger.height = 30;
        finger.y = gripper.height;
        if (index === 1) finger.x = gripper.width - finger.width;

        gripper.add(finger);
    });

    var finger1Rect = new Rect(0, 0, 100, this.gripper.width / 2 - fingers[0].width - 1);
    var finger2Rect = new Rect(0, this.gripper.width - fingers[1].width, 100, this.gripper.width / 2 + 1);

    Object.defineProperty(gripper, 'percent', {
        set: function (percent) {
            fingers[0].x = finger1Rect.y(percent);
            fingers[1].x = finger2Rect.y(percent);
        }
    });

    this.fingers = fingers;

    this.add(base);

    this.base = base;
}

Object.extend(Part, Robot);

var robot = new Robot('robot');
robot.x = 100;
robot.y = 100;

var robot2 = new Robot('robot-2');
robot2.x = 300;
robot2.y = 100;

document.body.appendChild(robot.element);
document.body.appendChild(robot2.element);

/**
 * Controller abstraction
 * 
 * @param {string} id The id of the DOM element associated to this component 
 * @param {Robot} robot The target robot to be controlled
 */
function Controller(id, robot) {
    Part.call(this, id);

    this.color = 'gray';
    this.width = 100;
    this.height = 100;

    var arm = new Part(undefined, 'input');

    arm.width = this.width * 0.9;
    arm.height = 10;
    arm.element.type = 'range';
    arm.element.min = -90;
    arm.element.max = 90;
    arm.element.value = 0;
    arm.style['-webkit-appearance'] = 'none';
    arm.style.margin = 0;
    arm.x = (this.width - arm.width) / 2;
    arm.y = 10;

    arm.element.addEventListener('input', function (event) {
        robot.arm.rotation = -event.target.value;
    });

    this.add(arm);

    var forearm = new Part(undefined, 'input');

    forearm.width = this.width * 0.9;
    forearm.height = 10;
    forearm.element.type = 'range';
    forearm.element.min = -135;
    forearm.element.max = 135;
    forearm.element.value = 0;
    forearm.style['-webkit-appearance'] = 'none';
    forearm.style.margin = 0;
    forearm.x = (this.width - forearm.width) / 2;
    forearm.y = arm.y + arm.height + 10;

    forearm.element.addEventListener('input', function (event) {
        robot.forearm.rotation = -event.target.value;
    });

    this.add(forearm);

    var gripper = new Part(undefined, 'input');

    gripper.width = this.width * 0.9;
    gripper.height = 10;
    gripper.element.type = 'range';
    gripper.element.min = 0;
    gripper.element.max = 100;
    gripper.element.value = 0;
    gripper.style['-webkit-appearance'] = 'none';
    gripper.style.margin = 0;
    gripper.x = (this.width - gripper.width) / 2;
    gripper.y = forearm.y + forearm.height + 10;

    gripper.element.addEventListener('input', function (event) {
        robot.gripper.percent = event.target.value;
    });

    this.add(gripper);
}

Object.extend(Part, Controller);

var controller = new Controller('controller', robot);
controller.x = robot.x + (robot.base.width - controller.width) / 2;
controller.y = 400;

document.body.appendChild(controller.element);

var controller2 = new Controller('controller-2', robot2);
controller2.x = robot2.x + (robot2.base.width - controller2.width) / 2;
controller2.y = 400;

document.body.appendChild(controller2.element);

