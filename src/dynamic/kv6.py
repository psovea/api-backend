import json
import zmq
import xmltodict
import gzip

CONTEXT = zmq.Context()
SOCKET = CONTEXT.socket(zmq.SUB)

url = 'tcp://pubsub.besteffort.ndovloket.nl:7658'

SOCKET.connect(url)

topicfilter = "/GVB/"
SOCKET.setsockopt_string(zmq.SUBSCRIBE, topicfilter)


def orderedDictToDict(od):
    return json.loads(json.dumps(od))


while True:
    message = SOCKET.recv_multipart()
    xml = gzip.decompress(message[1]).decode("utf-8")
    print(json.dumps(orderedDictToDict(xmltodict.parse(xml))))


