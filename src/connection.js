export class Connection {
  constructor(x, y, width, height, packetWaitTime) {
    this.x = x;
    this.y = y;
    this.color = '#00E52D';
    this.width = width;
    this.height = height;
    this.packetWaitTime = packetWaitTime;
    this.timeSinceLastPacket = 0;
    this.gradient = ['#00E52D', '#02E701', '#32E902', '#63EC03', '#95EE05', '#C7F006', '#F3EC07',
      '#F5BE09', '#F78F0A', '#FA600C', '#FC310D', '#FF0F1B'];
  }

  checkCollisions(packets) {
    // Credit: https://gist.github.com/vonWolfehaus/5023015
    let collisions = 0;
    packets.forEach((packet) => {
      const closestX = this.clamp(packet.x, this.x, this.x + this.width);
      const closestY = this.clamp(packet.y, this.y, this.y + this.height);

      // Calculate the distance between the circle's center and this closest point
      const distanceX = packet.x - closestX;
      const distanceY = packet.y - closestY;

      // If the distance is less than the circle's radius, an intersection occurs
      const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
      if (distanceSquared < (packet.radius * packet.radius)) {
        this.timeSinceLastPacket = 0;
        packet.lost = true;
      }
    });
    return collisions;
  }

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  update() {
    const val = Math.round((this.gradient.length - 1) * (this.timeSinceLastPacket / this.packetWaitTime));
    const i = this.clamp(val,0, (this.gradient.length - 1));
    this.color = this.gradient[i];
    this.timeSinceLastPacket++;
  }
}
