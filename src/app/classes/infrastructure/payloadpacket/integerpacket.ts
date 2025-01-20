export class IntegerPacket
{
    T: string = '';
    V: number = 0;

    public Serialize = () => JSON.stringify(this);
    public Deserialize = (input: string) => JSON.parse(input) as IntegerPacket;
}

export class IntegerPacketWrapper
{
    Topic: string = '';
    IntegerPacket: IntegerPacket = null as any;

    public static Create(topic: string, integerPacket: IntegerPacket)
    {
        let result = new IntegerPacketWrapper();
        result.Topic = topic;
        result.IntegerPacket = integerPacket;

        return result;
    }
}